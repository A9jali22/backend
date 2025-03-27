const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Function 1: Trigger when a new user is created
exports.sendUserWelcomeEmail = onDocumentCreated("users/{userId}", async (event) => {
    const userData = event.data.data();
    if (!userData) return console.error("❌ No user data found.");

    const { email, name } = userData;
    if (!email) return console.error("❌ No email found for user.");

    try {
        // Add email to Firestore Mail Collection
        await db.collection("mail").add({
            to: email,
            message: {
                subject: `Welcome to WorkTrace, ${name}! 🎉`,
                text: `Hello ${name},\n\nThank you for joining WorkTrace!`,
                html: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for joining WorkTrace! 🎉</p>`
            }
        });

        console.log(`✅ Welcome email triggered for: ${email}`);
    } catch (error) {
        console.error(`❌ Error sending welcome email:`, error);
    }
});

// Function 2: Trigger when user profile is updated
exports.notifyUserUpdate = onDocumentUpdated("users/{userId}", async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (!before || !after) return console.error("❌ Missing user data.");

    const { email, name } = after;
    if (!email) return console.error("❌ No email found for user.");

    try {
        // Add email to Firestore Mail Collection
        await db.collection("mail").add({
            to: email,
            message: {
                subject: `Your Profile was Updated, ${name}`,
                text: `Hello ${name},\n\nYour profile has been successfully updated!`,
                html: `<p>Hello <strong>${name}</strong>,</p><p>Your profile has been successfully updated!</p>`
            }
        });

        console.log(`✅ Profile update email triggered for: ${email}`);
    } catch (error) {
        console.error(`❌ Error sending profile update email:`, error);
    }
});

// Function 3: Trigger when user profile is deleted
exports.notifyUserDeletion = onDocumentDeleted("users/{userId}", async (event) => {
    const userData = event.data.data();
    if (!userData) return console.error("❌ No user data found.");

    const { email, name } = userData;
    if (!email) return console.error("❌ No email found for user.");

    try {
        // Add email to Firestore Mail Collection
        await db.collection("mail").add({
            to: email,
            message: {
                subject: `Goodbye from WorkTrace, ${name}`,
                text: `Hello ${name},\n\nYour account has been removed from WorkTrace.`,
                html: `<p>Hello <strong>${name}</strong>,</p><p>Your account has been removed from WorkTrace.</p>`
            }
        });

        console.log(`✅ Account deletion email triggered for: ${email}`);
    } catch (error) {
        console.error(`❌ Error sending deletion email:`, error);
    }
});
