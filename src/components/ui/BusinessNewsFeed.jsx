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
} from "antd";
import ReactTimeAgo from "react-time-ago";
import { ReloadOutlined, CaretDownOutlined } from "@ant-design/icons";

import PortfolioService from "../services/portfolio.service";
import "./BusinessNewsFeed.css";

function BusinessNewsFeed({ fullscreen }) {
  const [fullscreenWidth] = useState(fullscreen ? fullscreen : false);
  const [news, setNews] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    setNews(getListData(0));
    setPageSize(fullscreenWidth ? 8 : 4);
  }, [fullscreenWidth]);

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

  const refreshNews = () => {
    console.log("refresh news button clicked!");
    getListData(0);
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
    <Layout className={fullscreenWidth ? "news-feed-full" : "news-feed"}>
      {news ? (
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
      ) : (
        <div>
          <Spin tip="Loading" size="large">
            <Space>
              <Skeleton.Image active={true} size="large" />
              <Skeleton
                style={{ backgroundColor: "var(--dk-darker-bg)" }}
                paragraph={{ rows: 3 }}
              />
            </Space>
          </Spin>
        </div>
      )}
    </Layout>
  );
}

export default BusinessNewsFeed;
