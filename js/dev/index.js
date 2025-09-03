import { b as bodyUnlock, g as gotoBlock, a as getHash } from "./app.min.js";
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);
  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      if (targetElement.closest("[data-scrollto]")) {
        const gotoLink = targetElement.closest("[data-scrollto]");
        const gotoLinkSelector = gotoLink.dataset.scrollto ? gotoLink.dataset.scrollto : "";
        const noHeader = gotoLink.hasAttribute("data-scrollto-header") ? true : false;
        const gotoSpeed = gotoLink.dataset.scrolltoSpeed ? gotoLink.dataset.scrolltoSpeed : 500;
        const offsetTop = gotoLink.dataset.scrolltoTop ? parseInt(gotoLink.dataset.scrolltoTop) : 0;
        if (window.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fullpage-section]");
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fullpageId : null;
          if (fullpageSectionId !== null) {
            window.fullpage.switchingSection(fullpageSectionId);
            if (document.documentElement.hasAttribute("data-menu-open")) {
              bodyUnlock();
              document.documentElement.removeAttribute("data-menu-open");
            }
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }
        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      if (targetElement.dataset.watcher === "navigator") {
        document.querySelector(`[data-scrollto].navigator-active`);
        let navigatorCurrentItem;
        if (targetElement.id && document.querySelector(`[data-scrollto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-scrollto="#${targetElement.id}"]`);
        } else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-scrollto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-scrollto=".${element}"]`);
              break;
            }
          }
        }
        if (entry.isIntersecting) {
          navigatorCurrentItem ? navigatorCurrentItem.classList.add("navigator-active") : null;
        } else {
          navigatorCurrentItem ? navigatorCurrentItem.classList.remove("navigator-active") : null;
        }
      }
    }
  }
  if (getHash()) {
    let goToHash;
    if (document.querySelector(`#${getHash()}`)) {
      goToHash = `#${getHash()}`;
    } else if (document.querySelector(`.${getHash()}`)) {
      goToHash = `.${getHash()}`;
    }
    goToHash ? gotoBlock(goToHash) : null;
  }
}
document.querySelector("[data-scrollto]") ? window.addEventListener("load", pageNavigation) : null;
