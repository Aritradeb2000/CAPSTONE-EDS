/**
 * SEO Improvements Script
 * This script automatically adds alt text to images that don't have it
 * and implements other SEO best practices
 */

// Add alt text to images that don't have it
function addAltTextToImages() {
  const images = document.querySelectorAll('img:not([alt])');
  images.forEach((img) => {
    // Try to extract a meaningful alt text from various sources
    let altText = '';

    // Try to get alt text from parent element's text content
    if (img.parentElement && img.parentElement.textContent.trim()) {
      altText = img.parentElement.textContent.trim();
    }

    // Try to get alt text from image filename
    if (!altText && img.src) {
      const filename = img.src.split('/').pop().split('.')[0];
      if (filename) {
        // Convert filename to readable text (e.g., convert-kebab-case to "Convert Kebab Case")
        altText = filename
          .replace(/[-_]/g, ' ')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    // If we still don't have alt text, use a generic one based on page title
    if (!altText && document.title) {
      altText = `Image related to ${document.title}`;
    }

    // Set the alt text
    if (altText) {
      img.setAttribute('alt', altText);
    }
  });
}

// Add structured data for breadcrumbs if they exist
function addBreadcrumbStructuredData() {
  const breadcrumbs = document.querySelector('.breadcrumb');
  if (!breadcrumbs) return;

  const breadcrumbItems = breadcrumbs.querySelectorAll('li');
  if (!breadcrumbItems.length) return;

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [],
  };

  breadcrumbItems.forEach((item, index) => {
    const link = item.querySelector('a');
    if (link) {
      breadcrumbData.itemListElement.push({
        '@type': 'ListItem',
        position: index + 1,
        name: link.textContent.trim(),
        item: link.href,
      });
    } else if (item.textContent.trim()) {
      breadcrumbData.itemListElement.push({
        '@type': 'ListItem',
        position: index + 1,
        name: item.textContent.trim(),
      });
    }
  });

  if (breadcrumbData.itemListElement.length) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);
  }
}

// Improve heading structure if needed
function improveHeadingStructure() {
  // Check if there's an H1 on the page
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length === 0) {
    // If no H1, try to create one from the title
    if (document.title) {
      const mainElement = document.querySelector('main');
      if (mainElement && mainElement.firstElementChild) {
        const h1 = document.createElement('h1');
        const [title] = document.title.split(' - '); // Use the first part of the title
        h1.textContent = title;
        h1.style.position = 'absolute';
        h1.style.left = '-9999px';
        h1.style.height = '1px';
        h1.style.width = '1px';
        h1.style.overflow = 'hidden';
        mainElement.insertBefore(h1, mainElement.firstElementChild);
      }
    }
  }
}

// Add missing meta tags dynamically if they don't exist
function addMissingMetaTags() {
  const { head } = document;

  // Check and add viewport meta tag if missing
  if (!head.querySelector('meta[name="viewport"]')) {
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1';
    head.appendChild(viewportMeta);
  }

  // Check and add description meta tag if missing
  if (!head.querySelector('meta[name="description"]')) {
    const descriptionMeta = document.createElement('meta');
    descriptionMeta.name = 'description';
    descriptionMeta.content = document.title || 'Website Description';
    head.appendChild(descriptionMeta);
  }
}

// Run all SEO improvements when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  addAltTextToImages();
  addBreadcrumbStructuredData();
  improveHeadingStructure();
  addMissingMetaTags();
});
