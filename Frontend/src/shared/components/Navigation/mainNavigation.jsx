import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./mainHeader";
import SideDrawer from "./sideDrawer";
import NavLinks from "./navLinks";
import Backdrop from "../UIElements/backdrop";

import styles from "./mainNavigation.module.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerOpen] = useState(false);

  const closeDrawerHanlder = () => {
    setDrawerOpen(false);
  };
  const openDrawerHanlder = () => {
    setDrawerOpen(true);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHanlder} />}
      <SideDrawer show={drawerIsOpen}>
        <nav className={styles.drawerNav}>
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        {/* 반응형일 때 보여주는 메뉴 버튼 */}
        <button className={styles.menuButton} onClick={openDrawerHanlder}>
          <span />
          <span />
          <span />
        </button>

        <h1 className={styles.title}>
          <Link to="/">TODO Places</Link>
        </h1>
        <nav className={styles.headerNav}>
          <NavLinks />
        </nav>
      </MainHeader>
      <div></div>
    </>
  );
};

export default MainNavigation;
