# GeoNames API Setup

## Getting Your Free API Username

1. **Register for a free account**: https://www.geonames.org/login
2. **Confirm your email** by clicking the link in the confirmation email
3. **Enable free web services**: https://www.geonames.org/manageaccount
4. **Copy your username** from your account page

## Setting Up the Environment Variable

Create a `.env` file in the backend directory with:

```env
# GeoNames API Configuration
GEONAMES_USERNAME=your_actual_username_here

# Other existing variables...
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=plyo_user
DATABASE_PASSWORD=plyo_password
DATABASE_NAME=plyo_db
NODE_ENV=development
PORT=3000
```

## Free Tier Limits

- **20,000 requests per day** (more than enough for development)
- **No credit card required**
- **Instant activation**

## Testing

Once you've set up your username, restart the backend and test:

```bash
curl http://localhost:3000/api/cities/norwegian
```

You should see Norwegian cities data instead of an empty array.
