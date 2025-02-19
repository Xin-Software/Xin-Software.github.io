/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Updated to work with FontAwesome icons by re-rendering the icon.
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'
  
    // Mapping from theme to FontAwesome icon name (without the "fa-" prefix)
    const themeIconMap = {
      auto: 'wand-magic',
      light: 'sun',
      dark: 'moon'
    }
  
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    const setTheme = theme => {
      if (theme === 'auto') {
        document.documentElement.setAttribute(
          'data-bs-theme',
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        )
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }
  
    // Use FontAwesome's icon API to update the active icon in the toggle button.
    // This function will replace the inner HTML of the icon container.
    const updateActiveIcon = theme => {
      const iconName = themeIconMap[theme]
      if (!iconName) return
  
      // Generate the icon's SVG markup using FontAwesome's icon API.
      // This returns an object whose html property is an array of strings.
      const iconDefinition = FontAwesome.icon({
        prefix: 'fa-solid',
        iconName: iconName
      })
  
      if (!iconDefinition) return
  
      // Locate the container holding the active icon.
      // Assuming your toggle button has an element with the class 'theme-icon-active'
      // which originally is an <i> tag that FontAwesome converts to an inline SVG.
      const themeSwitcher = document.querySelector('#bd-theme')
      if (!themeSwitcher) return
  
      const activeIconContainer = themeSwitcher.querySelector('.theme-icon-active')
      if (!activeIconContainer) return
  
      // Replace the outer HTML of the active icon with the new SVG.
      // We then re-add the 'theme-icon-active' class to the new SVG.
      const newSvgHtml = iconDefinition.html.join('')
      // Create a temporary container to parse the HTML string.
      const tempContainer = document.createElement('div')
      tempContainer.innerHTML = newSvgHtml
      const newSvgElement = tempContainer.firstElementChild
      if (newSvgElement) {
        newSvgElement.classList.add('theme-icon-active')
        activeIconContainer.parentNode.replaceChild(newSvgElement, activeIconContainer)
      }
    }
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector('#bd-theme')
      if (!themeSwitcher) {
        return
      }
  
      const themeSwitcherText = document.querySelector('#bd-theme-text')
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
  
      // Update active state for each button
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
      })
  
      btnToActive.classList.add('active')
      btnToActive.setAttribute('aria-pressed', 'true')
  
      // Update the active icon using FontAwesome's API
      updateActiveIcon(theme)
  
      // Update the aria-label for accessibility
      if (themeSwitcherText) {
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
        themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
      }
  
      if (focus) {
        themeSwitcher.focus()
      }
    }
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      const preferredTheme = getPreferredTheme()
      setTheme(preferredTheme)
      showActiveTheme(preferredTheme)
  
      document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
    })
  })()
  