import { Button } from "@nextui-org/react";
import defaultImage from "../../public/images/image_event.jpg";

const EventCard = ({ event, formatDate, openPopUp }) => {
  return (
    <div className="shadow grid grid-cols-3 rounded-lg">
      <div className="col-span-1">
        {event.event_picture_url ? (
          <img
            className="w-full h-full object-cover"
            src={`http://127.0.0.1:3000${event.event_picture_url}`}
            alt="Event"
          />
        ) : (
          <img
            className="w-full h-full object-cover"
            src={defaultImage}
            alt="Event"
          />
        )}
      </div>
      <div className="col-span-2 px-4 py-2 space-y-2 flex flex-col">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl text-primary-dark font-Ubuntu">
            {event.category}
          </h1>
          <h5 className="text-base">{event.title}</h5>
        </div>
        <p className="text-center flex-grow">{event.description}</p>
        <p className="flex justify-center">{event.creator_id}</p>
        <div className="flex flex-row justify-center gap-4">
          {event.event_instruments.map((eventInstrument, index) => (
            <div
              key={index}
              className="border border-solid rounded-full px-3 py-1 text-white inline-block bg-lmds-red w-fixedButton text-center"
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
    // <div className="flex items-center self-center justify-around w-4/6 gap-5 p-5 m-5 bg-white shadow h-72">
    //   <div className="">
    //     {event.event_picture_url ? (
    //     <img
    //     className=""
    //     src={`http://127.0.0.1:3000${event.event_picture_url}`}
    //     alt="Event"
    //   />
    //     ) : (
    //     <img
    //     className=""
    //     src={defaultImage}
    //     alt="Event"
    //     />
    //     )}

    //   </div>
    //   <p className="flex self-start text-sm">{formatDate(event.start_date)}</p>
    //   <div className="flex flex-col items-center gap-0">
    //     <div className="flex flex-col items-center gap-0">
    //       <h3 className="underline">{event.category}</h3>
    //       <p className="">{event.title}</p>
    //     </div>
    //     <h3 className="underline">Description</h3>
    //     <p>{event.description}</p>
    //     <div className="flex gap-10">
    //       <Button className="text-white bg-info-main" onClick={() => openPopUp(event)}>Voir Plus</Button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default EventCard;
