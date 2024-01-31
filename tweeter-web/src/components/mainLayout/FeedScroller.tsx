import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import StatusItem from "../statusItem/StatusItem";

export const PAGE_SIZE = 10;

const FeedScroller = () => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<Status | null>(null);

  // Required to allow the addItems method to see the current value of 'items'
  // instead of the value from when the closure was created.
  const itemsReference = useRef(items);
  itemsReference.current = items;

  const addItems = (newItems: Status[]) =>
    setItems([...itemsReference.current, ...newItems]);

  const { displayedUser, setDisplayedUser, currentUser, authToken } =
    useContext(UserInfoContext);

  // Load initial items
  useEffect(() => {
    loadMoreItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreItems = async () => {
    try {
      if (hasMoreItems) {
        let [newItems, hasMore] = await loadMoreFeedItems(
          authToken!,
          displayedUser!,
          PAGE_SIZE,
          lastItem
        );

        setHasMoreItems(hasMore);
        setLastItem(newItems[newItems.length - 1]);
        addItems(newItems);
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to load feed items because of exception: ${error}`
      );
    }
  };

  const loadMoreFeedItems = async (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <div className="col bg-light mx-0 px-0">
              {/* StatusItem also constains Post component*/}
              <StatusItem value={item} />
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FeedScroller;
