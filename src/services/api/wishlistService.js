class WishlistService {
  constructor() {
    this.storageKey = "stayfinder_wishlist";
  }

  async getWishlist() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      items: [],
      lastUpdated: new Date().toISOString()
    };
  }

  async addItem(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const wishlist = await this.getWishlist();
    
    if (!wishlist.items.includes(propertyId)) {
      wishlist.items.push(propertyId);
      wishlist.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
    }
    
    return wishlist;
  }

  async removeItem(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const wishlist = await this.getWishlist();
    
    wishlist.items = wishlist.items.filter(id => id !== propertyId);
    wishlist.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
    
    return wishlist;
  }

  async clearWishlist() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const emptyWishlist = {
      items: [],
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(emptyWishlist));
    return emptyWishlist;
  }

  async isInWishlist(propertyId) {
    const wishlist = await this.getWishlist();
    return wishlist.items.includes(propertyId);
  }
}

export const wishlistService = new WishlistService();