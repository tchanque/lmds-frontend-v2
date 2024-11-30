import { Button } from "@nextui-org/react";
import defaultImage from "../../public/images/image_event.jpg";

const EventCard = ({ event, formatDate, openPopUp }) => {
  return (
    <div className="grid grid-cols-3 rounded-lg shadow">
      <div className="col-span-1">
        {event.event_picture_url ? (
          <img
            className="object-cover w-full h-full"
            src={event.event_picture_url}
            alt="Event"
          />
        ) : (
          <img
            className="object-cover w-full h-full"
            src={defaultImage}
            alt="Event"
          />
        )}
      </div>
      <div className="flex flex-col col-span-2 px-4 py-2 space-y-2">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl text-primary-dark font-Ubuntu">
            {event.category}
          </h1>
          <h5 className="text-base">{event.title}</h5>
        </div>
        <p className="flex-grow text-center">{event.description}</p>
        <p className="flex justify-center">{formatDate(event.start_date)}</p>
        <div className="flex flex-row justify-center gap-4">
          {event.event_instruments.map((eventInstrument, index) => (
            <div
              key={index}
              className="inline-block px-3 py-1 text-center text-white border border-solid rounded-full bg-lmds-red w-fixedButton"
            >
              {eventInstrument.instrument.name}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button
            className="text-white bg-info-main"
            onClick={() => openPopUp(event)}
          >
            Voir Plus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;