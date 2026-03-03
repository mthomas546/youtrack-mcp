/**
 * Commands API Client
 * 
 * Provides access to applying commands to multiple issues in YouTrack.
 * Commands allow bulk operations and state changes across issues.
 * 
 * @module CommandsAPI
 */

import { BaseAPIClient, MCPResponse } from '../base/base-client.js';
import { ResponseFormatter } from '../base/response-formatter.js';
import { logger } from '../../logger.js';

/**
 * Command execution parameters
 */
export interface CommandParams {
  /** The command text to apply */
  query: string;
  /** Position of caret in command (for suggestions) */
  caret?: number;
  /** Whether to run command silently (no notifications) */
  silent?: boolean;
  /** User to run command as */
  runAs?: string;
  /** Issue IDs to apply command to */
  issues?: Array<{ id?: string; idReadable?: string }>;
  /** Comment to add with command */
  comment?: string;
  /** Fields to return in response */
  fields?: string;
}

/**
 * API client for managing commands
 */
export class CommandsAPIClient extends BaseAPIClient {
  /**
   * Apply command to issues
   * 
   * @param params - Command parameters
   * @param muteNotifications - Whether to mute update notifications
   * @returns MCPResponse with command execution result
   */
  async applyCommand(params: CommandParams, muteNotifications = false): Promise<MCPResponse> {
    logger.debug('Applying command to issues', { params, muteNotifications });
    
    try {
      const endpoint = muteNotifications 
        ? '/commands?muteUpdateNotifications=true'
        : '/commands';
      
      const response = await this.post(endpoint, params);
      
      // The YouTrack API may return different response shapes:
      // - Success with no content (204)
      // - Success with command result object
      // - Success with array of affected issues
      // Handle all cases gracefully
      
      const data = response.data;
      
      // If response is empty or null, command was successful but no data returned
      if (data === null || data === undefined || data === '') {
        return ResponseFormatter.formatSuccess(
          { 
            applied: true, 
            command: params.query,
            issues: params.issues?.map(i => i.idReadable || i.id) || [],
            silent: params.silent || false
          },
          `Command "${params.query}" applied successfully`
        );
      }
      
      // If response is an array, it's the list of affected issues
      if (Array.isArray(data)) {
        return ResponseFormatter.formatSuccess(
          {
            applied: true,
            command: params.query,
            affectedIssues: data,
            count: data.length
          },
          `Command "${params.query}" applied to ${data.length} issue(s)`
        );
      }
      
      // If response is an object, return it wrapped properly
      return ResponseFormatter.formatSuccess(
        {
          applied: true,
          command: params.query,
          result: data
        },
        `Command "${params.query}" applied successfully`
      );
    } catch (error: any) {
      logger.error('Command execution failed', { error: error.message, params });
      
      // Extract useful error information from API response
      const errorMessage = error.response?.data?.error_description 
        || error.response?.data?.error 
        || error.message 
        || 'Unknown error';
      
      return ResponseFormatter.formatError(
        `Command failed: ${errorMessage}`,
        { command: params.query, issues: params.issues }
      );
    }
  }

  /**
   * Get command suggestions for current query
   * 
   * @param query - Partial command text
   * @param caret - Cursor position in command
   * @param issueIds - Issues context for suggestions
   * @returns MCPResponse with command suggestions
   */
  async getCommandSuggestions(query: string, caret?: number, issueIds?: string[]): Promise<MCPResponse> {
    logger.debug('Getting command suggestions', { query, caret });
    
    try {
      const issues = issueIds?.map(id => ({ idReadable: id }));
      
      const response = await this.post('/commands/assist', {
        query,
        caret: caret ?? query.length,
        issues
      });
      
      const data = response.data;
      
      // Handle empty response
      if (!data) {
        return ResponseFormatter.formatSuccess(
          { suggestions: [], query },
          'No suggestions available'
        );
      }
      
      // Extract suggestions from response
      const suggestions = data.suggestions || data;
      
      return ResponseFormatter.formatSuccess(
        {
          query,
          caret: caret ?? query.length,
          suggestions: Array.isArray(suggestions) ? suggestions : [suggestions]
        },
        `Retrieved ${Array.isArray(suggestions) ? suggestions.length : 1} suggestion(s)`
      );
    } catch (error: any) {
      logger.error('Failed to get command suggestions', { error: error.message });
      return ResponseFormatter.formatError(
        `Failed to get command suggestions: ${error.message}`,
        { query }
      );
    }
  }
}
