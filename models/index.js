const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        username: {
          type: String,
          unique: true,
          trim: true,
          required: true
        },
    
        email: {
          type: String,
          unique: true,
          validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
          },
          required: [true, "Email required"]
        },
    
        thoughts: [
          {
            type: Schema.Types.ObjectId,
            ref: "Thought",
          },
        ],
    
        friends: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
    },
    {
        toJSON: {
          virtuals: true,
        },
        id: false,
    }
);

UserSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
