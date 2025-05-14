/**
 * Share Service - Handles operations related to share table
 */

// Table name from the tables structure
const SHARE_TABLE = 'share';

/**
 * Fetch shares with optional filters
 * @param {Object} filters - Query filters
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Items per page
 * @returns {Promise<Array>} - List of shares
 */
export async function fetchShares(filters = {}, page = 0, limit = 20) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Build query parameters
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "link" } },
        { Field: { Name: "is_public" } },
        { Field: { Name: "has_password" } },
        { Field: { Name: "expires_in" } },
        { Field: { Name: "file_id" } },
        { Field: { Name: "CreatedOn" } }
      ],
      expands: [
        {
          name: "file_id",
          alias: "file"
        }
      ],
      where: [],
      pagingInfo: {
        limit: limit,
        offset: page * limit
      }
    };

    // Add filters if provided
    if (filters.fileId) {
      params.where.push({
        fieldName: "file_id",
        Operator: "ExactMatch",
        values: [filters.fileId]
      });
    }

    if (filters.isPublic !== undefined) {
      params.where.push({
        fieldName: "is_public",
        Operator: "ExactMatch",
        values: [filters.isPublic]
      });
    }

    const response = await apperClient.fetchRecords(SHARE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching shares:', error);
    throw error;
  }
}

/**
 * Get share by ID
 * @param {Number} id - Share ID
 * @returns {Promise<Object>} - Share data
 */
export async function getShareById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(SHARE_TABLE, id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching share with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create new share record
 * @param {Object} shareData - Share data
 * @returns {Promise<Object>} - Created share
 */
export async function createShare(shareData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Create share record with unique link
    const share = {
      ...shareData,
      link: `https://dropvault.example.com/share/${Math.random().toString(36).substring(2, 15)}`
    };

    // Create the record
    const response = await apperClient.createRecord(SHARE_TABLE, {
      records: [share]
    });
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating share:', error);
    throw error;
  }
}

/**
 * Delete share by ID
 * @param {Number} id - Share ID
 * @returns {Promise<Boolean>} - Success status
 */
export async function deleteShare(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Delete the record
    const response = await apperClient.deleteRecord(SHARE_TABLE, {
      RecordIds: [id]
    });
    return response.success;
  } catch (error) {
    console.error(`Error deleting share with ID ${id}:`, error);
    throw error;
  }
}