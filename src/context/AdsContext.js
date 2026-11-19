import React, { createContext, useContext, useState } from 'react';
import { INITIAL_ADS } from '../data/ads';

const AdsContext = createContext();

export function AdsProvider({ children }) {
  const [ads, setAds] = useState(INITIAL_ADS);
  const [feedback, setFeedback] = useState(null); // { id: number, text: string }

  const triggerFeedback = (text) => {
    setFeedback({ id: Date.now(), text });
  };

  const addAd = (newAd) => {
    const created = {
      ...newAd,
      id: Date.now().toString(),
    };
    setAds((prev) => [created, ...prev]);
    triggerFeedback('Skelbimas sėkmingai pridėtas!');
  };

  const updateAd = (updatedAd) => {
    setAds((prev) =>
      prev.map((item) => (item.id === updatedAd.id ? updatedAd : item))
    );
    triggerFeedback('Skelbimo duomenys atnaujinti!');
  };

  const deleteAd = (id) => {
    setAds((prev) => prev.filter((item) => item.id !== id));
    triggerFeedback('Skelbimas pašalintas.');
  };

  return (
    <AdsContext.Provider value={{ ads, addAd, updateAd, deleteAd, feedback }}>
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