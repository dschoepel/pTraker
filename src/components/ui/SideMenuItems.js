import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const iconStyle = { color: "var(--dk-gray-500)" };

export const sideMenuItems = [
  {
    key: "s1",
    icon: <DashboardOutlined style={iconStyle} />,
    label: <Link to="/home">Dashboard</Link>,
  },
  {
    key: "s2",
    icon: <VideoCameraOutlined style={iconStyle} />,
    label: "side 2",
  },
  {
    key: "s3",
    icon: <UploadOutlined style={iconStyle} />,
    label: "side 3",
  },
];
