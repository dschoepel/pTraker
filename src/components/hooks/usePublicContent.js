import { useState, useEffect } from "react";

import UserService from "../services/user.service";

export default function usePublicContent() {
  const [publicContent, setPublicContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setPublicContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setPublicContent(_content);
      }
    );
  }, []);
  return { publicContent };
}
