import "./allEventContainer.css";
import EventCard from "../event-card/eventCard";

const AllEventContainer = ({
  allEvents,
  eventRendering,
  handleDeleteEvent,
  handleUpdateEventStatus,
}) => {
  console.log("AllEventContainer => ", allEvents);
  return (
    <div>
      {
        <div className="flex w-full flex-wrap gap-x-4 gap-y-2 p-6 home-event-card-container">
          {allEvents?.map((event) => {
            return (
              <EventCard
                event={event}
                key={event._id}
                onDelete={handleDeleteEvent}
                onUpdateStatus={handleUpdateEventStatus}
              />
            );
          })}
        </div>
        //     : eventRendering == 'publishedEvents' ?
        //         <div className='home-event-card-container'>
        //             {allEvents?.map((event) => {
        //                 return event.published ? <EventCard event={event} key={event._id} /> : null
        //             })}
        //         </div>
        //         : eventRendering == 'unpublishedEvents' ?
        //             <div className='home-event-card-container'>
        //                 {allEvents?.map((event) => {
        //                     return !event.published ? <EventCard event={event} key={event._id} /> : null
        //                 })}
        //             </div>
        //             : null
        // }
      }
    </div>
  );
};

export default AllEventContainer;
