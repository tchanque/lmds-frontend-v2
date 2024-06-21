import EventForm from '../../Components/event_form/EventForm';
import AllEvents from '../../Components/show_events/AllEvents';
import './Home.css'

const Home = () => {
  return (
    <>
      <div className='content'>
        <h1>Home</h1>
        <EventForm></EventForm>
      </div>
      <div>
        <AllEvents />
      </div>
    </>
  );
}

export default Home;
