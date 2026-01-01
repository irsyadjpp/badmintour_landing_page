
import { db } from './lib/firebase-admin';

async function checkCoaches() {
  try {
    console.log("Checking for Coaches...");
    const usersRef = db.collection('users');

    // Query 1: role == 'coach'
    const snapshot1 = await usersRef.where('role', '==', 'coach').get();
    const coaches1 = snapshot1.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      role: doc.data().role
    }));

    // Query 2: roles array contains 'coach'
    const snapshot2 = await usersRef.where('roles', 'array-contains', 'coach').get();
    const coaches2 = snapshot2.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      roles: doc.data().roles
    }));

    console.log("--- COACHES (role='coach') ---");
    console.log(JSON.stringify(coaches1, null, 2));

    console.log("--- COACHES (roles has 'coach') ---");
    console.log(JSON.stringify(coaches2, null, 2));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

checkCoaches();
