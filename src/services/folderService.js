/**
 * Folder Service - Handles operations related to folder table
 */

// Table name from the tables structure
const FOLDER_TABLE = 'folder';

/**
 * Fetch folders with optional filters
 * @param {Object} filters - Query filters
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Items per page
 * @returns {Promise<Array>} - List of folders
 */
export async function fetchFolders(filters = {}, page = 0, limit = 20) {
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
        { Field: { Name: "Tags" } },
        { Field: { Name: "Owner" } },
        { Field: { Name: "parent_folder_id" } },
        { Field: { Name: "CreatedOn" } }
      ],
      expands: [
        {
          name: "parent_folder_id",
          alias: "parentFolder"
        }
      ],
      where: [],
      pagingInfo: {
        limit: limit,
        offset: page * limit
      }
    };

    // Add filters if provided
    if (filters.parentFolderId) {
      params.where.push({
        fieldName: "parent_folder_id",
        Operator: "ExactMatch",
        values: [filters.parentFolderId]
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      params.where.push({
        fieldName: "Tags",
        Operator: "Contains",
        values: filters.tags
      });
    }

    const response = await apperClient.fetchRecords(FOLDER_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
}

/**
 * Get folder by ID
 * @param {Number} id - Folder ID
 * @returns {Promise<Object>} - Folder data
 */
export async function getFolderById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(FOLDER_TABLE, id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching folder with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create new folder record
 * @param {Object} folderData - Folder data
 * @returns {Promise<Object>} - Created folder
 */
export async function createFolder(folderData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Create the record
    const response = await apperClient.createRecord(FOLDER_TABLE, {
      records: [folderData]
    });
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

/**
 * Delete folder by ID
 * @param {Number} id - Folder ID
 * @returns {Promise<Boolean>} - Success status
 */
export async function deleteFolder(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Delete the record
    const response = await apperClient.deleteRecord(FOLDER_TABLE, {
      RecordIds: [id]
    });
    return response.success;
  } catch (error) {
    console.error(`Error deleting folder with ID ${id}:`, error);
    throw error;
  }
}