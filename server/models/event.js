const mongose = require('mongoose');

const eventSchema = new mongose.Schema({
    eventName: {
        type: String
    },
    venue: {
        type: String
    },
    eventDate: {
        type: Date
    },
    eventCode: {
        type: String
    },
    coverImage: {
        type: String
    },
    description: {
        type: String
    },
    images: [
        {
            category: {
                type: String
            },
            imagesArr: [
                { type: String }]

        }
    ],
    emailsArray: [
        { type: String }
    ],
    videoLinks: [
        {
            title: {
                type: String
            },
            link: {
                type: String
            },
            description: {
                type: String
            },
            thumbnail: {
                type: String
            }
        }
    ],
    waterMarks: [
        {
            type: String
        }
    ],
    eventHost: {
        email: {
            type: String
        },
        name: {
            type: String
        },
        phone: {
            type: String
        }
    },
    eventAccessUsers: [
        {
            name: {
                type: String
            },
            email: {
                type: String
            },
            phone: {
                type: String
            },
            faceData: {
                type: String
            },
            // status : {
            //     type : String,
            //     enum : ["pending", "rejected", "accepted", "delivered"],
            // },
            sharedImagesArray: [
                {
                    type: String
                }
            ]
        }
    ],
    blockEmails: [
        {
            type: String
        }
    ],
    eventExpirationDate: {
        type: Date
    },
    dashboardId: {
        type: mongose.Schema.Types.ObjectId,
        ref: "dashboard",
    },
    status: {
        type: String,
        enum: ["published", "unpublished"],
        default: "unpublished"
    },
    // Settings
    //face search
    faceSearchAccess: {
        type: Boolean,
        default: false
    },
    faceSearchLink: {
        type: String
    },
    faceQrCode: {
        type: String
    },
    faceSearchPin: {
        type: String
    },
    //full access
    fullEventAccess: {
        type: Boolean,
        default: false
    },
    link: {
        type: String
    },
    qrCode: {
        type: String
    },
    fullAccessPin: {
        type: String
    },
    allowUserToPostImages: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const eventModel = mongose.model('event', eventSchema);
module.exports = eventModel