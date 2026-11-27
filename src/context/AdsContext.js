import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { INITIAL_ADS } from '../data/ads';
import { useAuth } from './Authcontext';

const AdsContext = createContext();

export function AdsProvider({ children }) {
  const { user, profile } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const triggerFeedback = (text) => {
    setFeedback({ id: Date.now(), text });
  };

  useEffect(() => {
    const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAds(list);
        setFetchError('');
        setLoading(false);
      },
      (error) => {
        setFetchError('Nepavyko nuskaityti skelbimų iš duomenų bazės: ' + error.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addAd = async (newAd) => {
    if (!user) throw new Error('Norėdami kurti skelbimą, turite prisijungti.');
    await addDoc(collection(db, 'ads'), {
      ...newAd,
      authorId: user.uid,
      authorName: profile?.name || user.email,
      authorEmail: user.email,
      createdAt: serverTimestamp(),
    });
    triggerFeedback('Skelbimas išsaugotas duomenų bazėje!');
  };

  const updateAd = async (adId, updatedFields) => {
    await updateDoc(doc(db, 'ads', adId), updatedFields);
    triggerFeedback('Skelbimo duomenys atnaujinti!');
  };

  const deleteAd = async (adId) => {
    await deleteDoc(doc(db, 'ads', adId));
    triggerFeedback('Skelbimas pašalintas iš duomenų bazės.');
  };

  // Pagalbinė funkcija įkelti 9 pavyzdinius skelbimus į tuščią DB
  const seedInitialAds = async () => {
    if (!user) throw new Error('Prisijunkite, kad įkeltumėte pradinius duomenis.');
    for (const item of INITIAL_ADS) {
      const { id, ...rest } = item;
      await addDoc(collection(db, 'ads'), {
        ...rest,
        authorId: user.uid,
        authorName: profile?.name || user.email,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
      });
    }
    triggerFeedback('Įkelta 9 pavyzdiniai skelbimai!');
  };

  return (
    <AdsContext.Provider
      value={{
        ads,
        loading,
        fetchError,
        addAd,
        updateAd,
        deleteAd,
        seedInitialAds,
        feedback,
      }}
    >
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  return useContext(AdsContext);
}
/*
7 eil.: inicializuoja skelbimų būseną pradiniais duomenimis iš INITIAL_ADS.

8 eil.: saugo paskutinio veiksmo pranešimą (feedback), pagal kurį sąrašo ekrane paleidžiama animacija.

14–21 eil. (addAd): sugeneruoja unikalų id (pagal laiką Date.now()) ir įdeda naują skelbimą į sąrašo pradžią.

23–28 eil. (updateAd): per map() suranda redaguojamą skelbimą pagal id ir pakeičia jį atnaujintais duomenimis.

30–33 eil. (deleteAd): per filter() pašalina skelbimą su nurodytu id iš būsenos.
*/