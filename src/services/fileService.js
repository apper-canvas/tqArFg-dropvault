/**
 * File Service - Handles operations related to file1 table
 */

// Table name from the tables structure
const FILE_TABLE = 'file1';

/**
 * Fetch files with optional filters
 * @param {Object} filters - Query filters
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Items per page
 * @returns {Promise<Array>} - List of files
 */
export async function fetchFiles(filters = {}, page = 0, limit = 20) {
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
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "size" } },
        { Field: { Name: "type" } },
        { Field: { Name: "status" } }
      ],
      where: [],
      pagingInfo: {
        limit: limit,
        offset: page * limit
      }
    };

    // Add filters if provided
    if (filters.status) {
      params.where.push({
        fieldName: "status",
        Operator: "ExactMatch",
        values: [filters.status]
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      params.where.push({
        fieldName: "Tags",
        Operator: "Contains",
        values: filters.tags
      });
    }

    const response = await apperClient.fetchRecords(FILE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

/**
 * Get file by ID
 * @param {Number} id - File ID
 * @returns {Promise<Object>} - File data
 */
export async function getFileById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(FILE_TABLE, id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching file with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create new file record
 * @param {Object} fileData - File data
 * @returns {Promise<Object>} - Created file
 */
export async function createFile(fileData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Create the record
    const response = await apperClient.createRecord(FILE_TABLE, {
      records: [fileData]
    });
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

/**
 * Update file record
 * @param {Object} fileData - Updated file data (must include Id)
 * @returns {Promise<Object>} - Updated file
 */
export async function updateFile(fileData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Update the record
    const response = await apperClient.updateRecord(FILE_TABLE, {
      records: [fileData]
    });
    return response.results[0].data;
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
}

/**
 * Delete file by ID
 * @param {Number} id - File ID
 * @returns {Promise<Boolean>} - Success status
 */
export async function deleteFile(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Delete the record
    const response = await apperClient.deleteRecord(FILE_TABLE, {
      RecordIds: [id]
    });
    return response.success;
  } catch (error) {
    console.error(`Error deleting file with ID ${id}:`, error);
    throw error;
  }
}