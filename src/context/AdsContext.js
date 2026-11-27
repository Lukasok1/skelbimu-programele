import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { db } from '../config/firebase';
import { INITIAL_ADS } from '../data/ads';
import { useAuth } from './AuthContext';

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
    const adsRef = ref(db, 'ads');
    const unsubscribe = onValue(
      adsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data)
            .map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setAds(list);
        } else {
          setAds([]);
        }
        setFetchError('');
        setLoading(false);
      },
      (error) => {
        setFetchError('Nepavyko nuskaityti skelbimų iš Realtime DB: ' + error.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addAd = async (newAd) => {
    if (!user) throw new Error('Norėdami kurti skelbimą, turite prisijungti.');
    const newAdRef = push(ref(db, 'ads'));
    await set(newAdRef, {
      ...newAd,
      authorId: user.uid,
      authorName: profile?.name || user.email,
      authorEmail: user.email,
      createdAt: serverTimestamp(),
    });
    triggerFeedback('Skelbimas išsaugotas Realtime DB!');
  };

  const updateAd = async (adId, updatedFields) => {
    await update(ref(db, `ads/${adId}`), updatedFields);
    triggerFeedback('Skelbimo duomenys atnaujinti!');
  };

  const deleteAd = async (adId) => {
    await remove(ref(db, `ads/${adId}`));
    triggerFeedback('Skelbimas pašalintas iš duomenų bazės.');
  };

  const seedInitialAds = async () => {
    if (!user) throw new Error('Prisijunkite, kad įkeltumėte pradinius duomenis.');
    for (const item of INITIAL_ADS) {
      const { id, ...rest } = item;
      const newAdRef = push(ref(db, 'ads'));
      await set(newAdRef, {
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