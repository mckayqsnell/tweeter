import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import Post from "../statusItem/Post";
import useToastListener from "../toaster/ToastListenerHook";

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

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      let alias = extractAlias(event.target.toString());

      let user = await getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
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
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={item.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {item.user.firstName} {item.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={item.user.alias}
                        onClick={(event) => navigateToUser(event)}
                      >
                        {item.user.alias}
                      </Link>
                    </h2>
                    {item.formattedDate}
                    <br />
                    <Post status={item} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FeedScroller;
