import axiosInstance from '../utils/axiosConfig';

const neo4jService = {
  // Getthe hello world test message from Neo4j
  getHelloWorld: async () => {
    try {
      const response = await axiosInstance.get('/neo4j/hello-world');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching Neo4j hello world:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to connect to Neo4j'
      };
    }
  },

  // Check Neo4j connection health
  checkHealth: async () => {
    try {
      const response = await axiosInstance.get('/neo4j/health');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error checking Neo4j health:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check Neo4j health'
      };
    }
  },

  // Get knowledge graph data
  getKnowledgeGraph: async () => {
    try {
      const response = await axiosInstance.get('/neo4j/knowledge-graph');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching knowledge graph:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch knowledge graph'
      };
    }
  },

  // Create a new node in the knowledge graph
  createNode: async (nodeData) => {
    try {
      const response = await axiosInstance.post('/neo4j/nodes', nodeData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating node:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create node'
      };
    }
  },

  // Create a new relationship between nodes
  createRelationship: async (relationshipData) => {
    try {
      const response = await axiosInstance.post('/neo4j/relationships', relationshipData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating relationship:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create relationship'
      };
    }
  }
};

export default neo4jService;