
# RizzPay Payment Gateway

## Performance Optimizations

The application has been optimized to prevent unnecessary refreshes and improve performance:

### Supabase Optimizations:
- Singleton Supabase client pattern to prevent multiple instance creation
- Debounced connection checks to reduce API calls
- Connection timeouts to prevent hanging requests
- Enhanced error handling for failed network requests
- Improved caching strategy for transactions (5-minute cache)

### React Optimizations:
- Components wrapped with React.memo to prevent unnecessary re-renders
- Event handlers wrapped with useCallback to maintain referential equality
- Optimized lazy loading with improved suspense boundaries
- Added replace flag to navigations to prevent history stack issues

### Loading States:
- Better loading indicators with fallback UI
- Graceful degradation when Supabase is offline
- Optimistic UI updates where possible

## Development Recommendations

1. Always use the imported Supabase client from `@/integrations/supabase/client` rather than creating new instances
2. Wrap pure components with React.memo
3. Use useCallback for event handlers passed as props
4. Consider implementing proper data fetching patterns with React Query
5. Split large components into smaller, focused ones

