const express = require('express');
const router = express.Router();
const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

// Create a Dialogflow session client
// Make sure you have GOOGLE_APPLICATION_CREDENTIALS environment variable set
// or pass the credentials directly
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DIALOGFLOW_KEY_FILE || './serviceAccountKey.json'
});

const projectId = process.env.DIALOGFLOW_PROJECT_ID || 'your-project-id';

/**
 * POST /api/chatbot/query
 * Send a query to Dialogflow and get a response
 */
router.post('/query', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create a session ID if not provided
    const session = sessionId || uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, session);

    // The text query request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    // Send request to Dialogflow
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Extract the response
    const reply = result.fulfillmentText || "I'm not sure how to respond to that.";
    
    // You can also access intent and parameters
    const intent = result.intent?.displayName;
    const parameters = result.parameters?.fields;

    res.json({
      reply,
      intent,
      parameters,
      sessionId: session,
      confidence: result.intentDetectionConfidence
    });

  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ 
      error: 'Failed to process chatbot query',
      details: error.message 
    });
  }
});

/**
 * POST /api/chatbot/event
 * Trigger a Dialogflow event
 */
router.post('/event', async (req, res) => {
  try {
    const { eventName, sessionId, parameters } = req.body;

    if (!eventName) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    const session = sessionId || uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, session);

    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: eventName,
          parameters: parameters || {},
          languageCode: 'en-US',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      reply: result.fulfillmentText,
      sessionId: session
    });

  } catch (error) {
    console.error('Dialogflow event error:', error);
    res.status(500).json({ 
      error: 'Failed to trigger event',
      details: error.message 
    });
  }
});

module.exports = router;
