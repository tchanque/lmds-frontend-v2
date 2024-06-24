import { useState, useEffect } from "react";

const SkillsForm = ({
  id,
  instrument,
  onInstrumentChange,
  onInstrumentDestroy,
}) => {
  const [localInstrument, setLocalInstrument] = useState(instrument.instrument);
  const [localLevel, setLocalLevel] = useState([]);

  useEffect(() => {
    onInstrumentChange(id, "instrument", localInstrument);
  }, [localInstrument]);

  useEffect(() => {
    onInstrumentChange(id, "level", localLevel);
  }, [localLevel]);

  const handleRadioChange = (event) => {
    setLocalLevel(event.target.value);
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-5">
        <div>
          {" "}
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
            <option hidden value="">
              Choisissez un instrument
            </option>
            <option value="Guitare">Guitare</option>
            <option value="Batterie">Batterie</option>
            <option value="Piano">Piano</option>
            <option value="Ukulélé">Ukulélé</option>
            <option value="Basse">Basse</option>
            <option value="MAO">M.A.O</option>
            <option value="Chant">Chant</option>
            <option value="Harmonie">Harmonie</option>
          </select>
        </div>
        
        <div>
        <label htmlFor="level" className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white">Choisissez un niveau:</label>
          <div id="level" className="flex gap-1 bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            
            <input type="radio" name="level1" value="1" checked={localLevel === "1"} onChange={handleRadioChange} />
            <label htmlFor="1">1</label><br />

            <input type="radio" name="level2" value="2" checked={localLevel === "2"} onChange={handleRadioChange} />
            <label htmlFor="2">2</label><br />

            <input type="radio" name="level3" value="3" checked={localLevel === "3"} onChange={handleRadioChange} />
            <label htmlFor="3">3</label><br />

            <input type="radio" name="level4" value="4" checked={localLevel === "4"} onChange={handleRadioChange} />
            <label htmlFor="4">4</label><br />

            <input type="radio" name="level5" value="5" checked={localLevel === "5"} onChange={handleRadioChange} />
            <label htmlFor="5">5</label><br />
          </div>
        </div>

      </div>
      <div className="flex justify-end mt-2 mr-5">
        <button onClick={() => onInstrumentDestroy(id)} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            fill="#F31248"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );

}

export default SkillsForm;