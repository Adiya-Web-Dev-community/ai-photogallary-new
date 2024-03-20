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
      {allEvents && allEvents.length === 0 ? (
        <div className="text-center text-2xl font-bold text-gray-500">
          <p>No events listed</p>
        </div>
      ) : (
        <div className="flex w-full flex-wrap gap-x-4 gap-y-2 p-6 home-event-card-container">
          {allEvents &&
            allEvents.map((event) => (
              <EventCard
                event={event}
                key={event._id}
                onDelete={handleDeleteEvent}
                onUpdateStatus={handleUpdateEventStatus}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AllEventContainer;
