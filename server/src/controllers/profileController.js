import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user._id });
    }
    res.json({
      success: true,
      profile,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, educationLevel, skills, interests, workExperience, bio, theme, savedFilters } = req.body;

    if (name) {
      req.user.name = name;
      await req.user.save();
    }

    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new Profile({ userId: req.user._id });
    }

    if (educationLevel !== undefined) profile.educationLevel = educationLevel;
    if (skills !== undefined) profile.skills = skills;
    if (interests !== undefined) profile.interests = interests;
    if (workExperience !== undefined) profile.workExperience = workExperience;
    if (bio !== undefined) profile.bio = bio;
    if (theme !== undefined) profile.theme = theme;
    if (savedFilters !== undefined) profile.savedFilters = savedFilters;

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      profile,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { profileImage: fileUrl },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Profile avatar updated!',
      profileImage: fileUrl,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { resumeUrl: fileUrl },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Resume PDF uploaded successfully!',
      resumeUrl: fileUrl,
      profile,
    });
  } catch (error) {
    next(error);
  }
};
