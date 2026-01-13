import { useState, useEffect, useRef, useCallback } from "react";
import { SearchIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from "../Icons";
import { MENU_ITEMS, SCROLL_CONFIG } from "../../constants";
import styles from "./Header.module.css";

function Header({ searchQuery = "", onSearchChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const lastScrollY = useRef(0);
  const [menuVisible, setMenuVisible] = useState(true);
  const headerTopRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const headerHeight = headerTopRef.current?.offsetHeight || 0;
          
          // Определяем, когда меню становится sticky
          if (scrollTop >= headerHeight) {
            // Вычисляем, сколько прокрутили после прилипания
            const scrollAfterSticky = scrollTop - headerHeight;
            const hideThreshold = SCROLL_CONFIG.HIDE_THRESHOLD;
            
            // Определяем направление скролла
            const scrollingDown = scrollTop > lastScrollY.current;
            
            // Если прокрутили больше threshold вниз после прилипания - скрываем
            if (scrollingDown && scrollAfterSticky > hideThreshold) {
              setMenuVisible(false);
            } 
            // Если прокручиваем наверх - показываем
            else if (!scrollingDown) {
              setMenuVisible(true);
            }
          } else {
            // Если прокрутили до верха - убираем класс hidden и сбрасываем состояние
            setMenuVisible(true);
          }
          
          lastScrollY.current = scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Инициализация при загрузке
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (isMobileMenuOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      
      // Блокируем скролл страницы на body и html
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Разблокируем скролл страницы
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      
      // Восстанавливаем позицию скролла
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // Очистка при размонтировании компонента
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => {
      const newValue = !prev;
      if (newValue && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      } else {
        onSearchChange?.("");
      }
      return newValue;
    });
  }, [onSearchChange]);

  const handleSearchChange = useCallback((e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  }, [onSearchChange]);

  return (
    <>
      <header className={styles.header}>
        {/* Top section with logo */}
        <div ref={headerTopRef} className={styles.headerTop}>
          <div className={styles.headerTopContainer}>
            <div className={styles.headerTopContent}>
              <button
                className={styles.headerMobileMenuButton}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <span className={styles.headerMobileMenuLine}></span>
                <span className={styles.headerMobileMenuLine}></span>
                <span className={styles.headerMobileMenuLine}></span>
              </button>
              <div className={`${styles.headerLogoWrapper} ${isSearchOpen ? styles.headerLogoSearchOpen : ''}`}>
                <img 
                  src="/Logotype.svg" 
                  alt="LOGOTYPE" 
                  className={styles.headerLogo}
                />
              </div>
              <div className={styles.headerSearchWrapper}>
                <div className={`${styles.headerSearchInputWrapper} ${isSearchOpen ? styles.headerSearchOpen : ''}`}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={styles.headerSearchInput}
                    autoFocus={isSearchOpen}
                  />
                </div>
                {!isSearchOpen ? (
                  <button
                    onClick={handleSearchToggle}
                    className={styles.headerSearchButton}
                    aria-label="Search"
                  >
                    <SearchIcon className={styles.headerSearchIcon} />
                  </button>
                ) : (
                  <button
                    onClick={handleSearchToggle}
                    className={styles.headerSearchButton}
                    aria-label="Close search"
                  >
                    <CloseIcon className={styles.headerCloseIcon} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal menu - sticky */}
      <nav
        className={`${styles.headerNav} ${!menuVisible ? styles.headerNavHidden : ''}`}
      >
          <div className={styles.headerNavContainer}>
            <ul className={styles.headerNavList}>
              {MENU_ITEMS.map((item, index) => (
                <li
                  key={index}
                  className={styles.headerNavItem}
                >
                  <a
                    href={item.href}
                    className={styles.headerNavLink}
                  >
                    {item.label}
                    {item.submenu && <ChevronDownIcon className={styles.headerNavChevron}/>}
                  </a>
                  {item.submenu && (
                    <ul className={styles.headerNavSubmenu}>
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          {subIndex > 0 && (
                            <hr className={styles.headerNavSubmenuDivider} />
                          )}
                          <a
                            href={subItem.href}
                            className={styles.headerNavSubmenuLink}
                          >
                            {subItem.label}
                            <ChevronRightIcon className={styles.headerNavSubmenuChevron} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

      {/* Mobile menu overlay */}
      <div
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOverlayOpen : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
      >
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileMenuLogoWrapper}>
                <img 
                  src="/Logotype.svg" 
                  alt="LOGOTYPE" 
                  className={styles.mobileMenuLogo}
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={styles.mobileMenuCloseButton}
                aria-label="Close menu"
              >
                <CloseIcon className={styles.mobileMenuCloseIcon} />
              </button>
            </div>
            <nav className={styles.mobileMenuNav}>
              <ul className={styles.mobileMenuList}>
                {MENU_ITEMS.map((item, index) => (
                  <li key={index}>
                    {index > 0 && <hr className={styles.mobileMenuDivider} />}
                    {item.submenu ? (
                      <details className={styles.mobileMenuDetails}>
                        <summary className={styles.mobileMenuItemButton}>
                          {item.label}
                          <ChevronDownIcon className={styles.mobileMenuChevron} />
                        </summary>
                        <ul className={styles.mobileMenuSubmenu}>
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <a
                                href={subItem.href}
                                className={styles.mobileMenuSubmenuLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subItem.label}
                                <ChevronRightIcon className={styles.mobileMenuSubmenuChevron} />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <a
                        href={item.href}
                        className={styles.mobileMenuItemLink}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
    </>
  );
}

export default Header;
