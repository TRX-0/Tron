# Get nodejs image
FROM node:10

# Install git
RUN apt-get update && apt-get -qy install git

# Add user tron
RUN useradd -ms /sbin/nologin bot
USER bot
WORKDIR /home/bot/

# Clone the bot
RUN git clone https://github.com/A-G-Angelopoulos/Tron.git
# Install npm packages
WORKDIR /home/bot/Tron
RUN npm install &&  npm install discord.js

# Get auth and config
USER root
ADD auth.json .
ADD config.json .
RUN chown bot:bot /home/bot/Tron/auth.json && chown bot:bot /home/bot/Tron/config.json #&& chown bot:bot /home/bot/Tron/start.json

# Get entrypoint
COPY entrypoint.sh /
RUN chown bot:bot /entrypoint.sh && chmod +x /entrypoint.sh
USER bot
ENTRYPOINT ["/entrypoint.sh"]
