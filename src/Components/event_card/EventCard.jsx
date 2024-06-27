import { Button } from "@nextui-org/react";

const EventCard = ({ event, formatDate, openPopUp }) => {
  return (
    <div className="flex items-center self-center justify-around gap-5 p-5 m-5 bg-white shadow h-72">
      <div className="w-80">
        <img
          className=""
          src="https://media.istockphoto.com/id/1667873018/fr/photo/gar%C3%A7on-jouant-de-la-batterie-dans-une-%C3%A9cole-de-musique.jpg?s=2048x2048&w=is&k=20&c=Bn0w595KUKm2zDPhSDREM4o9nd5wSc94vpd4ADxruRo="
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