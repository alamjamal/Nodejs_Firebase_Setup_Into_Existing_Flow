const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	roles: { type: String, enum: ["FUser","PUser"], required: true },
	name: { type: String, required: true },
	mobile: { type: String,  trim: true },
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true },
	address: {
		pinCode: { type: String, trim: true },
		localAddress: { type: String },
		district: { type: String },
		state: { type: String },
	},
	isApproved: { type: Boolean, default: false },
	isActivate: { type: Boolean, default: false },
	userDP: { type: String },
	firebase:[{
		_id:false,
		provider:{type:String},
		uid:{type:String},
		picture:{type:String},
		name:{type:String},
	}]
}, { timestamps: true });



const hashSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	hashString: { type: String, required: true },
	createdAt: { type: Date, default: Date.now(), expires: "10" },
	expireAt:{type:Date},
	attemptCount:{type:Number, default:0}
});




const userTokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref:'User'
	},
	token: {
		type:String,
		required: true,
	}, //refresh Token
	expires: {
		type: Date,
		required: true,
	}

});



userSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
		delete ret.__v;
		delete ret.createdAt;
		delete ret.updatedAt;
		delete ret.password;
	}
});



const User = mongoose.model("User", userSchema);
const UserHash = mongoose.model("UserHash", hashSchema);
const UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = {
	User,
	UserToken,
	UserHash
};

