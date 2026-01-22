import { collection, query, where, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this path matches

/**
 * Uploads a single file to Cloudinary.
 * Handles both Image (jpg, png) and Raw (dcm) uploads automatically.
 * 
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "diagnoscope_upload");

    const isDicom = file.name.toLowerCase().endsWith(".dcm");

    // DICOM -> Raw endpoint, Others -> Image endpoint
    const uploadUrl = isDicom
        ? "https://api.cloudinary.com/v1_1/di6ffijwf/raw/upload"
        : "https://api.cloudinary.com/v1_1/di6ffijwf/image/upload";

    console.log(`Uploading ${file.name} to ${isDicom ? 'RAW' : 'IMAGE'} endpoint...`);

    try {
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Cloudinary Error: ${response.status} ${errorDetails}`);
        }

        const data = await response.json();

        if (!data.secure_url) {
            throw new Error("Upload failed: No secure_url returned");
        }

        return data.secure_url;
    } catch (error) {
        console.error("Upload Service Error:", error);
        throw error;
    }
}

/**
 * Uploads multiple files to Cloudinary in parallel.
 * 
 * @param {File[]} files - Array or FileList of files
 * @returns {Promise<string[]>} - Array of secure URLs
 */
export async function uploadMultipleFiles(files) {
    const fileArray = Array.from(files);
    console.log(`Starting upload for ${fileArray.length} files...`);

    // Upload all files in parallel
    const urlPromises = fileArray.map(file => uploadToCloudinary(file));
    const urls = await Promise.all(urlPromises);

    return urls;
}

/**
 * Unified function to upload images AND save/update Firestore data.
 * 
 * Logic:
 * 1. Uploads files to Cloudinary.
 * 2. Checks Firestore for an existing document with the given `case_id`.
 * 3. If FOUND: Updates that document (appends images).
 * 4. If NOT FOUND: Creates a NEW document with an AUTO-GENERATED ID.
 * 
 * @param {string} caseId - The Case ID entered by the doctor.
 * @param {Object} metadata - Other fields (doctor info, report type, etc).
 * @param {File[]} files - The files to upload.
 */
export async function saveCaseToFirestore(caseId, metadata, files) {
    if (!db) {
        console.warn("Firestore not initialized. Running in Offline Mode (no save).");
        return;
    }

    if (!caseId) {
        console.error("No Case ID provided. Cannot save.");
        return;
    }

    const cleanId = String(caseId).trim();
    console.log(`Processing Firestore Save for Case ID: ${cleanId}...`);

    try {
        // STEP 1: Upload Images first
        const imageUrls = await uploadMultipleFiles(files);
        console.log("Images uploaded:", imageUrls);

        // STEP 2: Check if a document with this 'case_id' already exists
        const casesRef = collection(db, "cases");
        const q = query(casesRef, where("case_id", "==", cleanId)); // Query by field, not Doc ID
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // --- SCENARIO: EXISTING CASE ---
            // Existing document found. We use its Auto-Generated ID to update it.
            const existingDoc = querySnapshot.docs[0]; // Take the first match
            const docRef = existingDoc.ref;

            console.log(`Found existing document (ID: ${existingDoc.id}) for Case ${cleanId}. Updating...`);

            await updateDoc(docRef, {
                // Append new images to the array
                Image_urls: arrayUnion(...imageUrls),
                // Update metadata if needed (or keep old?). User implied updating fields.
                // We'll merge the metadata provided.
                ...metadata,
                last_updated: new Date().toISOString()
            });
            console.log("Existing document updated successfully.");

        } else {
            // --- SCENARIO: NEW CASE ---
            // No match found. Create a NEW document with an AUTO-GENERATED ID.
            console.log(`No existing record for Case ${cleanId}. Creating NEW document...`);

            const newCaseData = {
                case_id: cleanId, // Store the user-entered ID as a field
                Image_urls: imageUrls, // Initial array of images
                ...metadata, // All passed metadata (doctor, severity, etc)
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            };

            // addDoc automatically generates a unique Document ID
            const newDocRef = await addDoc(casesRef, newCaseData);
            console.log(`New Document Created! Auto-ID: ${newDocRef.id}`);
        }

        return imageUrls; // RETURN URLS FOR UI
    } catch (error) {
        console.error("CRITICAL FIRESTORE ERROR in saveCaseToFirestore:", error);
        // We log but don't re-throw to avoid crashing the UI (White Screen), unless strictly needed.
        return [];
    }
}
