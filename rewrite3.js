import fs from 'fs';

let content = fs.readFileSync('src/context/DataContext.tsx', 'utf8');

const newSyncLogic = `
async function syncCollection(
  collectionName: string,
  localData: any[],
  setState: React.Dispatch<React.SetStateAction<any[]>>
) {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty && localData && localData.length > 0) {
      try {
        const batch = writeBatch(db);
        localData.forEach(item => {
          const docRef = doc(colRef, item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      } catch (e) {
        console.warn("Could not seed", collectionName, e);
      }
    }

    return onSnapshot(colRef, (snap) => {
      const data: any[] = [];
      snap.forEach((doc) => data.push(doc.data()));
      if (data.length > 0) {
        setState(data);
      }
    });
  } catch (e) {
    console.warn("Could not sync", collectionName, e);
    return () => {};
  }
}

async function syncSingleton(
  docName: string,
  localData: any,
  setState: React.Dispatch<React.SetStateAction<any>>
) {
  try {
    const docRef = doc(db, 'singletons', docName);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists() && localData) {
      try {
        await setDoc(docRef, localData);
      } catch (e) {
        console.warn("Could not seed singleton", docName, e);
      }
    }
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.slides) setState(data.slides);
        else if (data.states) setState(data.states);
        else if (data.countries) setState(data.countries);
        else if (data.offers) setState(data.offers);
        else setState(data as any);
      }
    });
  } catch (e) {
    console.warn("Could not sync singleton", docName, e);
    return () => {};
  }
}
`;

content = content.replace(/async function syncCollection[\s\S]*?async function syncSingleton[\s\S]*?\}\n\}/, newSyncLogic.trim());

fs.writeFileSync('src/context/DataContext.tsx', content);
