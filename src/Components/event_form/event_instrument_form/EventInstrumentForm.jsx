import { useState, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";

const EventInstrumentForm = ({ id, instrument, onInstrumentChange }) => {
  const [localInstrument, setLocalInstrument] = useState(instrument.instrument);
  const [localLevel, setLocalLevel] = useState(instrument.level);
  const [localTotalSpots, setLocalTotalSpots] = useState(instrument.totalSpots);

  useEffect(() => {
    onInstrumentChange(id, "instrument", localInstrument);
  }, [localInstrument]);

  useEffect(() => {
    onInstrumentChange(id, "level", localLevel);
  }, [localLevel]);

  useEffect(() => {
    onInstrumentChange(id, "totalSpots", localTotalSpots);
  }, [localTotalSpots]);

  const levelOptions = [0, 1, 2, 3, 4, 5];

  return (
    <div>
      <h1>Nouvel Instrument</h1>
      <div>
        <label
          htmlFor="instrument"
          className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
        >
          Instrument
        </label>
        <select
          name="instrument"
          id="instrument"
          value={localInstrument}
          onChange={(e) => setLocalInstrument(e.target.value)}
          className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Instrument"
          required
        >
          <option value="Guitare">Guitare</option>
          <option value="Batterie">Batterie</option>
          <option value="Piano">Piano</option>
          <option value="Ukulélé">Ukulélé</option>
          <option value="Basse">Basse</option>
          <option value="MAO">M.A.O</option>
          <option value="Chant">Chant</option>
          <option value="Harmonie">Harmonie</option>
        </select>

        <label
          htmlFor="level"
          className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
        >
          Niveau
        </label>

        <Select
          name="level"
          label="level"
          placeholder="Choisissez un/des niveau(x)"
          selectionMode="multiple"
          className="text-grey-main"
          onSelectionChange={(selected) => setLocalLevel(selected)}
          defaultValue={localLevel}
        >
          {levelOptions.map((option, index) => (
            <SelectItem key={index}>{`${option}`}</SelectItem>
          ))}
        </Select>

        <div>
          <label
            htmlFor="total_spots"
            className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
          >
            Places disponibles
          </label>
          <input
            type="number"
            name="total_spots"
            id="total_spots"
            value={localTotalSpots}
            onChange={(e) => setLocalTotalSpots(e.target.value)}
            className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Séletionne le nombre de places"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EventInstrumentForm;
