const isSearchPage = (pathName) => {
  return pathName === "/search";
};

const hasGroupIdAndProjectId = (url) => {
  const urlObj = new URL(url);
  return urlObj.searchParams.has("group_id") && urlObj.searchParams.has("project_id");
};

const trimText = (text) => {
  return text.replace("\n", "").trim();
};

const fetchURLDetailsWithProjectId = () => {
  const url = new URL(window.location.href);
  let projectId = url.searchParams.get("project_id");

  let formSection = document.querySelector(".search-page-form").children[0];
  let groupEle = formSection.children[1];
  let groupName = trimText(groupEle.querySelector(".dropdown-toggle-text").textContent);
  let projectEle = formSection.children[2];
  let projectName = trimText(projectEle.querySelector(".dropdown-toggle-text").textContent);
  return {
    baseRemovedURL: "",
    branchName: "master",
    branchNameURL: "master",
    dir: [groupName, projectName],
    dirFormatted: `${groupName}/${projectName}`,
    dirURLParam: `${groupName}%2F${projectName}`,
    projectId: projectId
  }
};

export const fetchURLDetails = () => {
  const pathName = window.location.pathname;
  if (isSearchPage(pathName) && hasGroupIdAndProjectId(window.location.href)) {
    return fetchURLDetailsWithProjectId();
  }

  const pathNameSplit = pathName
    .split("/")
    .filter((pathSub) => pathSub.length !== 0);
  let dir = [];
  let branchName = document.querySelector(".dropdown-toggle-text")
    ? document.querySelector(".dropdown-toggle-text").innerText
    : "master";
  let branchNameSplit = branchName
    .split("/")
    .filter((pathSub) => pathSub.length !== 0);
  let branchFound = false;
  let findingBranch = false;
  let baseRemovedURLItems = [];
  for (let i = 0; i < pathNameSplit.length; i++) {
    if (findingBranch) {
      if (!branchFound) {
        i += branchNameSplit.length;
        branchFound = true;
      }
      baseRemovedURLItems.push(pathNameSplit[i]);
    } else {
      if (pathNameSplit[i] === "-") {
        i++;
        findingBranch = true;
      } else if (
        pathNameSplit[i] === "blob" ||
        pathNameSplit[i] === "tree" ||
        pathNameSplit[i] === "blame" ||
        pathNameSplit[i] === "commits" ||
        pathNameSplit[i] === "find_file"
      ) {
        findingBranch = true;
      } else {
        dir.push(pathNameSplit[i]);
      }
    }
  }
  const dirFormatted = dir.join("/");
  const baseRemovedURL = baseRemovedURLItems.join("/");

  const projectId = document.body.getAttribute("data-project-id");

  return {
    dir,
    dirFormatted: dirFormatted,
    dirURLParam: encodeURIComponent(dir.join("/")),
    branchName,
    branchNameURL: encodeURIComponent(branchName),
    baseRemovedURL: baseRemovedURL,
    projectId,
  };
};
