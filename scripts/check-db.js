
const admin = require('firebase-admin');

// Inline Config
const serviceAccount = {
  projectId: "badmintour-bf6ec",
  clientEmail: "firebase-adminsdk-fbsvc@badmintour-bf6ec.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5Doo+kvjH6Shc\nnJfc2yJFnqC6srHelZ76vuJUHY84K1/L7RDcXIrjC9mttMjYwPUjSCvzWLP3O+QD\nJ5TaA4A8m6FwYtouewJYfGGvIsaWd7jAQH7eaH8XQCsygKb5tLgOr86b/1iLQhcU\nCjayo0UFglMTNIHnb38YhB8Hmj4ooEnMdIoh18kKHsTQMBvOJbyYGuhelWK69ljb\nM53hxGds7Ctvc9lpaZ1CF5Tf4ShRShjhoIZiG1hqnfsfqlx2N6ceptLh2+EmdEVK\nv8xu2hdA/e5I5KsX8+VrI+0K99uQAFs7iWui0Gey1ZrP/MnTzwDdZ7wR02WFIzDp\nlB2sxnR9AgMBAAECggEAAc6THyh1uT6nqCcs8hk0qjaHOL4hGlHehHHD3tDkErG/\nuiDFivVKCOIB0oj4SL+HlTwxllXIehKcYm3VmFReQUPpbWIVtyGjL08q8ALDACSe\nn0fx79othYIDpKGuH7Q584YYGnIBlhMuNldMMJiDW8SplX+BgODtPjAfZ8ZZMtyA\n4s4clbSBcVO/Xmm8C5bmhhZ8bOiMMhitpBXh2FsUjfam5fsBWg7yF5EFdj5DnqMF\njaQctjko6XaDw3kmMBwecqOqAigG8NGS9/Xah84WVF0G3TZ0c8d8x7WBm3ydf+8A\nSrwfOXvJWS+WvKpOazCIyZSwBS1/tHMHJst9gHZI+QKBgQDjSuMUFpi16YkfRSt+\nUhAut65tq4djo9bQRPBfhfCETJ7gopdwBT3N7i5xyTERRvAvTOBXz3MgoR/jAeeF\n+0jkB6tt2t2dss8o2jx2yvadzICmM2dysLXj/OdWNuXuqYtHJrs1AGGbVPGeVuMS\n9yInsOgCu2wpxM+iG8QxBgNRBQKBgQDQbgiFSS9YzaGJV4DZGKBTtQOgg2R/2Xcu\n77tR/9h0/oxbDKQjW1FSPW3XzmveihP16uVP8Wu4/PZAqOF6MqrL/NV2xKMUVzO2\n+qs1xcd7zvVn/gZwWaohFukm2ZTqHRjxYeIh2zPTFCOxKV9sUhNwA5qFN8qo8/Cj\nT5KH9RdPGQKBgQCpR9r72SB/S6GOoouUFzZqNO86SugY86tHjjCgVDcfsZkaoL28\n9opjVyNMJ5Xd0kGMWOs1OxH5mUcQYRi4FsDg5D1vIfSwQL49JNyndN5cBDVEk0BW\nkPnHBVKeSWDScX+DzHrdLJ2FfKw/S2LvexP7D6ycbE5QhX5Gs/tYr6vEqQKBgQCg\npf65RMRSjQPRyPkN25ZPjniCMmO2yxW6vppBxJHA8yWZU+/7NHpEigZszLSFrSVf\naTJf4LNnvMnM4p4Pwpe0bGbXiQ4tMl0wzppB8vQjcEvkYH30AJhJss/32sKVg+Hi\nwtA5yityqNYtyba71bMXph9mSK9Sc9ro9P76/aR+mQKBgQDSaWyrqBH+gMzutrPh\n6+ErmgN3T96e4HFoW2imMbQb8pnAd/nS1/oltcmx1qcfgHMDp8txuqYjaTLxYy/i\nujw2Au1LVDWlIw6rU/2uCLVmWrxaO/mL/2oJfTIocPR/R8YFIYIuvEQ+CVy0KvKl\nlSIdIbQgBoGv3SOBCqNMYzxtzA==\n-----END PRIVATE KEY-----".replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkData() {
  console.log("Checking Firestore Data...");

  try {
    // 1. Members
    // .count() requires specific sdk version, using size for safety in script
    const usersSnap = await db.collection("users").get();
    console.log(`Total Users (via size): ${usersSnap.size}`);

    if (!usersSnap.empty) {
      console.log("Sample User:", JSON.stringify(usersSnap.docs[0].data(), null, 2));
    }

    // 2. Bookings
    const bookingsAll = await db.collection("bookings").get();
    console.log(`Total Bookings: ${bookingsAll.size}`);

    const bookingsPaid = await db.collection("bookings").where("status", "in", ["paid", "confirmed", "CONFIRMED", "Paid"]).get();
    console.log(`Paid/Confirmed Bookings Count: ${bookingsPaid.size}`);

    if (!bookingsPaid.empty) {
      console.log("Sample Paid Booking:", JSON.stringify(bookingsPaid.docs[0].data(), null, 2));
    } else {
      console.log("No Paid Bookings found. Listing all statuses:");
      bookingsAll.docs.forEach(d => console.log(`- ${d.id}: ${d.data().status}`));
    }

    // 3. Events
    const eventsSnap = await db.collection("events").get();
    console.log(`Total Events: ${eventsSnap.size}`);
    if (!eventsSnap.empty) {
      const sample = eventsSnap.docs[0].data();
      console.log("Sample Event Date:", sample.date, "| Title:", sample.title);
    }

  } catch (error) {
    console.error("Error checking DB:", error);
  }
}

checkData();
