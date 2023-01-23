const getIsCollapsed = () => {
  return JSON.parse(localStorage.getItem("isCollapsed"));
};

const setIsCollapsed = (isCollapsed) => {
  localStorage.setItem("isCollapsed", isCollapsed);
};

const SidebarService = {
  getIsCollapsed,
  setIsCollapsed,
};

export default SidebarService;
