import propertiesData from "@/services/mockData/properties.json";

class PropertyService {
  constructor() {
    this.properties = [...propertiesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.properties];
  }

async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const property = this.properties.find(p => p.Id === id);
    if (!property) return null;

    // Get review data for this property
    try {
const { reviewService } = await import('@/services/api/reviewService');
      const reviewData = await reviewService.getByPropertyId(id);
      
      return {
        ...property,
        rating: reviewData.averageRating || property.rating,
        reviewCount: reviewData.totalCount || property.reviewCount
      };
    } catch (error) {
      // Fallback to original property data if review service fails
      console.warn('Failed to load review data:', error);
      return { ...property };
    }
  }

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    let results = [...this.properties];

    if (query.location) {
      const location = query.location.toLowerCase();
      results = results.filter(property =>
        property.location.city.toLowerCase().includes(location) ||
        property.location.country.toLowerCase().includes(location) ||
        property.title.toLowerCase().includes(location)
      );
    }

    if (query.guests && query.guests > 1) {
      results = results.filter(property =>
        property.capacity.guests >= query.guests
      );
    }

    if (query.priceRange) {
      results = results.filter(property =>
        property.pricing.nightlyRate >= query.priceRange.min &&
        property.pricing.nightlyRate <= query.priceRange.max
      );
    }

    if (query.propertyTypes && query.propertyTypes.length > 0) {
      results = results.filter(property =>
        query.propertyTypes.includes(property.propertyType)
      );
    }

    if (query.amenities && query.amenities.length > 0) {
      results = results.filter(property =>
        query.amenities.every(amenity =>
          property.amenities.includes(amenity)
        )
      );
    }

    return results;
  }

async create(propertyData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...this.properties.map(p => p.Id)) + 1;
    const newProperty = {
      Id: newId,
      ...propertyData,
      rating: 0,
      reviewCount: 0
    };
    this.properties.push(newProperty);
    return { ...newProperty };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.properties.findIndex(p => p.Id === id);
    if (index === -1) return null;

    this.properties[index] = { ...this.properties[index], ...updates };
    return { ...this.properties[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.properties.findIndex(p => p.Id === id);
    if (index === -1) return false;

    this.properties.splice(index, 1);
    return true;
  }
}

export const propertyService = new PropertyService();