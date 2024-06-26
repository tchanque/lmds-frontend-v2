import { Button } from "@nextui-org/react";
import { useState } from "react";

const EventCard = ({ event, formatDate, openPopUp }) => {
  return (
    <div className="flex items-center self-center justify-around w-4/6 gap-5 p-5 m-5 bg-white shadow h-72">
      <div className="w-80">
        <img
          className=""
          src={`http://127.0.0.1:3000${event.event_picture_url}`}
          alt="Event"
        />
      </div>
      <p className="flex self-start text-sm">{formatDate(event.start_date)}</p>
      <div className="flex flex-col items-center gap-0">
        <div className="flex flex-col items-center gap-0">
          <h3 className="underline">{event.category}</h3>
          <p className="">{event.title}</p>
        </div>
        <h3 className="underline">Description</h3>
        <p>{event.description}</p>
        <div className="flex gap-10">
          <Button className="text-white bg-info-main" onClick={() => openPopUp(event)}>Voir Plus</Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;