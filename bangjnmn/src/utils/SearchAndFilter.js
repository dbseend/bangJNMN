import React from "react";

//데이터 필터 예시(작성자, 제목 필터 적용)
const filteredData = inquires.filter((item) => {
    if (!item) {
      return false;
    }
    if (selectedCategory === "") {
      if (searchTerm === "") {
        return item;
      } else {
        return item.title && item.title.includes(searchTerm);
      }
    } else if (selectedCategory === "title") {
      if (searchTerm === "") {
        return !item.access || item.access === true;
      } else {
        return (!item.access || item.access === true) && item.title && item.title.includes(searchTerm);
      }
    } else if (selectedCategory === "user") {
      if (searchTerm === "") {
        return item;
      } else {
        return item.user.name && item.user.name.includes(searchTerm);
      }
    }
  });