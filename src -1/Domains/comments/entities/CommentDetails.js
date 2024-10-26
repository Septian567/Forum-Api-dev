class CommentDetails {
   constructor(payload) {
      this._verifyPayload(payload);
      this._extractPayloadData(payload);
   }

   _verifyPayload(payload) {
      this._checkRequiredProperties(payload);
      this._checkPropertyTypes(payload);
   }

   _checkRequiredProperties({
      id, content, date, username, replies,
   }) {
      if (!id || !content || !date || !username || !replies) {
         throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
      }
   }

   _checkPropertyTypes({
      id, content, date, username, replies,
   }) {
      if (
         typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || !Array.isArray(replies)
      ) {
         throw new Error('COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE');
      }
   }

   _extractPayloadData({
      id, content, date, username, replies,
   }) {
      this.id = id;
      this.content = content;
      this.date = date;
      this.username = username;
      this.replies = replies;
   }
}

module.exports = CommentDetails;
