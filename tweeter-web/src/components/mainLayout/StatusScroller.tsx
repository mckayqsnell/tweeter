import { AuthToken, Status, User } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import StatusItem from "../statusItem/StatusItem";
import useUserInfo from "../userInfo/UserInfoHook";
import { StatusItemPresenter, StatusItemView } from "../../presenter/StatusItemPresenter";

interface Props {
  presenterGenerator: (view: StatusItemView) => StatusItemPresenter;
}

const StatusScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);

  // Required to allow the addItems method to see the current value of 'items'
  // instead of the value from when the closure was created.
  const itemsReference = useRef(items); // DON't MOVE THIS
  itemsReference.current = items;

  // This should not be moved to a presenter because it is a hook
  const { displayedUser, authToken } =
    useUserInfo();

  // Load initial items
  useEffect(() => {
    loadMoreItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listener: StatusItemView  = {
    addItems: (newItems: Status[]) => setItems([...itemsReference.current, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  }

  // To prevent the presenter from being recreated on every render
  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    // ! is used to tell TypeScript that the value is not null
    presenter.loadMoreItems(authToken!, displayedUser!);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <div className="col bg-light mx-0 px-0">
              <StatusItem value={item} />
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

//StatusScroller.propTypes = {};

export default StatusScroller;
