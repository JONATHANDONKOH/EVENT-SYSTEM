import cloudinary from "../Config/cloudinary.js";
import fs from "fs";
import upload from "../Middlewares/uploadMiddleware.js"; // your multer config

// @route POST /events
async function createEventHandler(req, res) {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      interest_id: interestId,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime,
      event_location: eventLocation,
      capacity,
    } = req.body;

    const fieldError = validateEventFields(req.body);
    if (fieldError) return res.status(400).json({ message: fieldError });

    const interestError = await validateInterestExists(interestId);
    if (interestError) return res.status(400).json({ message: interestError });

    // Upload file to Cloudinary if provided
    let imageUrl = null;
    if (req.file) {
      const resourceType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
        resource_type: resourceType,
      });

      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // cleanup temp file
    }

    const event = await createEvent({
      userId,
      interestId,
      title,
      description,
      eventDate,
      startTime,
      endTime,
      eventLocation,
      imageUrl,
      capacity: capacity ?? null,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
