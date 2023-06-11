import React, { useState, useEffect, Fragment } from "react";
import {
  Layout,
  Tooltip,
  List,
  Image,
  Button,
  Divider,
  Typography,
  Skeleton,
  Spin,
  Space,
  Avatar,
} from "antd";
import ReactTimeAgo from "react-time-ago";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReloadOutlined, CaretDownOutlined } from "@ant-design/icons";

import PortfolioService from "../services/portfolio.service";
import "./BusinessNews.css";

function BusinessNews({ fullscreen }) {
  const [fullscreenWidth] = useState(fullscreen ? fullscreen : false);
  const [news, setNews] = useState([]);
  const [newsFeedIndex, setNewsFeedIndex] = useState(0);

  const [newsFeed, setNewsFeed] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    setNews(getListData(1000));
    setPageSize(8);
  }, []);

  function getListData(timeoutInMilliseconds) {
    const timeout = timeoutInMilliseconds ? timeoutInMilliseconds : 0;
    console.log("Getting news....");
    setIsRefreshing(true);
    setTimeout(() => {
      PortfolioService.getRSSNewsFeeds()
        .then((response) => {
          setNews(response.newsFeed);
          console.log("fetchnews response: ", response);
        })
        .catch((error) => {
          console.log("Error fetching RSS news feeds!  Error - ", error);
        });
      setIsRefreshing(false);
    }, timeout);
  }

  const emptyAvatar = <Skeleton.Avatar shape="square" />;
  const emptyDescription = <Skeleton active paragraph={{ rows: 10 }} />;
  const emptyList = [{ avatar: emptyAvatar, description: emptyDescription }];

  const refreshNews = () => {
    console.log("refresh news button clicked!");
    getListData(1000);
  };

  const decodeString = (string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(
      "<!doctype html><body>" + string,
      "text/html"
    );
    const decodedString = dom.body.textContent;
    return decodedString;
  };

  return (
    <Layout className={"news-feed-full1"}>
      {
        news ? (
          <div
            load
            id="scrollableDiv"
            style={{
              height: 725,
              overflow: "auto",
              padding: "0 ",
              border: "1px solid var(--dk-gray-300)",
              borderRadius: "8px",
              // backgroundColor: "var(--dk-gray-500)",
            }}
          >
            <InfiniteScroll
              style={{
                // backgroundColor: "var(--dk-gray-500)",
                margin: "0 1.5rem",
              }}
              dataLength={news.length}
              // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              endMessage={<Divider plain>End of News!</Divider>}
              scrollableTarget="scrollableDiv"
            >
              <List
                loading={isRefreshing}
                className="news-feed-list1"
                bordered={false}
                header={
                  <Fragment>
                    <Tooltip title="Refresh" mouseLeaveDelay={0}>
                      <Button
                        // size="small"
                        type="primary"
                        icon={<ReloadOutlined />}
                        style={{ marginRight: "1rem" }}
                        onClick={refreshNews}
                        // loading={isRefreshing}
                      />
                    </Tooltip>
                    <span className="news-feed-item-title">
                      Recent Financial News
                    </span>
                  </Fragment>
                }
                dataSource={news}
                // pagination={{
                //   position: "top",
                //   align: "center",
                //   pageSize: `${pageSize}`,
                //   size: "small",
                //   showSizeChanger: false,
                // }}
                renderItem={(item, index) => (
                  <List.Item className="news-feed-item1">
                    <List.Item.Meta
                      title={
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="news-feed-item-url1"
                        >
                          {decodeString(item.title)}
                        </a>
                      }
                      description={
                        <Fragment>
                          {item.description ? (
                            <Typography.Paragraph
                              ellipsis={{
                                rows: 2,
                                symbol: <CaretDownOutlined />,
                                expandable: true,
                              }}
                              className="news-feed-item-text1"
                            >
                              {decodeString(item.description)}
                            </Typography.Paragraph>
                          ) : null}
                          {item.description ? (
                            <Divider
                              style={{ margin: "0.5rem 0 0 0" }}
                              type="horizontal"
                            />
                          ) : null}
                          <span className="news-feed-published1">
                            {item.source} -{" "}
                            <ReactTimeAgo
                              date={item.published}
                              timeStyle={"twitter"}
                            />
                          </span>
                        </Fragment>
                      }
                      avatar={
                        item.thumbnail?.url ? (
                          <Image
                            preview={false}
                            placeholder={true}
                            src={item?.thumbnail?.url}
                            width={75}
                            height={50}
                          />
                        ) : null
                      }
                    />
                  </List.Item>
                )}
              ></List>
            </InfiniteScroll>
          </div>
        ) : (
          <List
            dataSource={emptyList}
            loading={isRefreshing}
            bordered={true}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={item.avatar}
                  description={item.description}
                ></List.Item.Meta>
              </List.Item>
            )}
          ></List>
        )
        // <div>
        //   <Spin tip="Loading" size="large">
        //     <List bordered={true} classname="news-feed-full1">
        //       <Skeleton avatar active={true} size="large" />

        //       <Skeleton
        //         // style={{ backgroundColor: "var(--dk-darker-bg)" }}
        //         active={true}
        //         size="large"
        //         paragraph={{ rows: 3 }}
        //       />
        //     </List>
        //   </Spin>
        // </div>
      }

      {/* {news ? (
        <List
          className="news-feed-list"
          bordered={true}
          header={
            <Fragment>
              <Tooltip title="Refresh" mouseLeaveDelay={0}>
                <Button
                  // size="small"
                  type="primary"
                  icon={<ReloadOutlined />}
                  style={{ marginRight: "1rem" }}
                  onClick={refreshNews}
                  loading={isRefreshing}
                />
              </Tooltip>
              <span>Recent Financial News</span>
            </Fragment>
          }
          dataSource={news}
          pagination={{
            position: "top",
            align: "center",
            pageSize: `${pageSize}`,
            size: "small",
            showSizeChanger: false,
          }}
          renderItem={(item, index) => (
            <List.Item className="news-feed-item">
              <List.Item.Meta
                title={
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="news-feed-item-url"
                  >
                    {decodeString(item.title)}
                  </a>
                }
                description={
                  <Fragment>
                    {item.description ? (
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 2,
                          symbol: <CaretDownOutlined />,
                          expandable: true,
                        }}
                        className="news-feed-item-text"
                      >
                        {decodeString(item.description)}
                      </Typography.Paragraph>
                    ) : null}
                    {item.description ? (
                      <Divider
                        style={{ margin: "0.5rem 0 0 0" }}
                        type="horizontal"
                      />
                    ) : null}
                    <span className="news-feed-item-text">
                      {item.source} -{" "}
                      <ReactTimeAgo
                        date={item.published}
                        timeStyle={"twitter"}
                      />
                    </span>
                  </Fragment>
                }
                avatar={
                  item.thumbnail?.url ? (
                    <Image
                      preview={false}
                      placeholder={true}
                      src={item?.thumbnail?.url}
                      width={75}
                      height={50}
                    />
                  ) : null
                }
              />
            </List.Item>
          )}
        ></List>
      ) : null} */}
    </Layout>
  );
}

export default BusinessNews;
