import { toast } from "react-toastify";
import React from "react";

class PropertyService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'property_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "country_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "nightly_rate_c"}},
          {"field": {"Name": "cleaning_fee_c"}},
          {"field": {"Name": "service_fee_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "beds_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "host_name_c"}},
          {"field": {"Name": "host_avatar_c"}},
          {"field": {"Name": "host_verified_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "min_stay_c"}},
          {"field": {"Name": "max_stay_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(property => this._formatProperty(property));
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "country_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "lat_c"}},
          {"field": {"Name": "lng_c"}},
          {"field": {"Name": "nightly_rate_c"}},
          {"field": {"Name": "cleaning_fee_c"}},
          {"field": {"Name": "service_fee_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "beds_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "host_name_c"}},
          {"field": {"Name": "host_avatar_c"}},
          {"field": {"Name": "host_verified_c"}},
          {"field": {"Name": "host_id_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "min_stay_c"}},
          {"field": {"Name": "max_stay_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success || !response.data) {
        return null;
      }

      return this._formatProperty(response.data);
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "country_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "nightly_rate_c"}},
          {"field": {"Name": "cleaning_fee_c"}},
          {"field": {"Name": "service_fee_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}}
        ],
        where: [],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      // Add location filter
      if (query.location) {
        params.whereGroups = [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "city_c", "operator": "Contains", "values": [query.location]},
                {"fieldName": "country_c", "operator": "Contains", "values": [query.location]},
                {"fieldName": "title_c", "operator": "Contains", "values": [query.location]}
              ],
              "operator": "OR"
            }
          ]
        }];
      }

      // Add guests filter
      if (query.guests && query.guests > 1) {
        params.where.push({
          "FieldName": "guests_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [query.guests.toString()]
        });
      }

      // Add price range filter
      if (query.priceRange) {
        if (query.priceRange.min > 0) {
          params.where.push({
            "FieldName": "nightly_rate_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [query.priceRange.min.toString()]
          });
        }
        if (query.priceRange.max > 0) {
          params.where.push({
            "FieldName": "nightly_rate_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [query.priceRange.max.toString()]
          });
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(property => this._formatProperty(property));
    } catch (error) {
      console.error("Error searching properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(propertyData) {
    try {
      const params = {
        records: [{
          Name: propertyData.title || propertyData.title_c || 'New Property',
          title_c: propertyData.title || propertyData.title_c,
          description_c: propertyData.description,
          property_type_c: propertyData.propertyType || propertyData.property_type_c,
          city_c: propertyData.location?.city || propertyData.city_c,
          country_c: propertyData.location?.country || propertyData.country_c,
          address_c: propertyData.location?.address || propertyData.address_c,
          nightly_rate_c: propertyData.pricing?.nightlyRate || propertyData.nightly_rate_c || 0,
          cleaning_fee_c: propertyData.pricing?.cleaningFee || propertyData.cleaning_fee_c || 0,
          service_fee_c: propertyData.pricing?.serviceFee || propertyData.service_fee_c || 0,
          currency_c: propertyData.pricing?.currency || propertyData.currency_c || 'USD',
          guests_c: propertyData.capacity?.guests || propertyData.guests_c || 1,
          bedrooms_c: propertyData.capacity?.bedrooms || propertyData.bedrooms_c || 1,
          bathrooms_c: propertyData.capacity?.bathrooms || propertyData.bathrooms_c || 1,
          beds_c: propertyData.capacity?.beds || propertyData.beds_c || 1,
          host_name_c: propertyData.host?.name || propertyData.host_name_c || 'Host',
          host_verified_c: propertyData.host?.verified || propertyData.host_verified_c || false,
          rating_c: 0,
          review_count_c: 0
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create property:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this._formatProperty(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating property:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.title !== undefined) updateData.title_c = updates.title;
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.propertyType !== undefined) updateData.property_type_c = updates.propertyType;
      if (updates.nightly_rate_c !== undefined) updateData.nightly_rate_c = updates.nightly_rate_c;
      if (updates.cleaning_fee_c !== undefined) updateData.cleaning_fee_c = updates.cleaning_fee_c;
      if (updates.service_fee_c !== undefined) updateData.service_fee_c = updates.service_fee_c;
      if (updates.guests_c !== undefined) updateData.guests_c = updates.guests_c;
      if (updates.bedrooms_c !== undefined) updateData.bedrooms_c = updates.bedrooms_c;
      if (updates.bathrooms_c !== undefined) updateData.bathrooms_c = updates.bathrooms_c;
      if (updates.rating_c !== undefined) updateData.rating_c = updates.rating_c;
      if (updates.review_count_c !== undefined) updateData.review_count_c = updates.review_count_c;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update property:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this._formatProperty(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating property:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete property:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting property:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Helper method to format database record to frontend format
  _formatProperty(dbProperty) {
    return {
      Id: dbProperty.Id,
      title: dbProperty.title_c || dbProperty.Name || '',
      description: dbProperty.description_c || '',
      propertyType: dbProperty.property_type_c || '',
      location: {
        address: dbProperty.address_c || '',
        city: dbProperty.city_c || '',
        country: dbProperty.country_c || '',
        coordinates: {
          lat: parseFloat(dbProperty.lat_c) || 0,
          lng: parseFloat(dbProperty.lng_c) || 0
        }
      },
      pricing: {
        nightlyRate: parseFloat(dbProperty.nightly_rate_c) || 0,
        cleaningFee: parseFloat(dbProperty.cleaning_fee_c) || 0,
        serviceFee: parseFloat(dbProperty.service_fee_c) || 0,
        currency: dbProperty.currency_c || 'USD'
      },
      capacity: {
        guests: parseInt(dbProperty.guests_c) || 1,
        bedrooms: parseInt(dbProperty.bedrooms_c) || 1,
        bathrooms: parseInt(dbProperty.bathrooms_c) || 1,
        beds: parseInt(dbProperty.beds_c) || 1
      },
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1515263487990-61b07816b00a?w=800&h=600&fit=crop"
      ],
      amenities: ["WiFi", "Air conditioning", "Kitchen", "Washer", "TV", "Parking"],
      rating: parseFloat(dbProperty.rating_c) || 0,
      reviewCount: parseInt(dbProperty.review_count_c) || 0,
      host: {
        id: dbProperty.host_id_c || 'host1',
        name: dbProperty.host_name_c || 'Host',
        avatar: dbProperty.host_avatar_c || "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
        joinDate: dbProperty.join_date_c || 'Recently',
        verified: dbProperty.host_verified_c || false
      },
      availability: {
        calendar: {},
        minStay: parseInt(dbProperty.min_stay_c) || 1,
        maxStay: parseInt(dbProperty.max_stay_c) || 30
      }
    };
  }
}

export const propertyService = new PropertyService();