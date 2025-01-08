import { Request, Response } from 'express';
import Resource from '../models/Resource';
import asyncHandler from 'express-async-handler';

interface Resource {
  title: string;
  description: string;
  type: 'course' | 'book' | 'paper' | 'tool';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  tags: string[];
  ratings: number[];
  comments: {
    user: string;
    text: string;
    createdAt: Date;
  }[];
}

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getResources = asyncHandler(async (req: Request, res: Response) => {
  const resources = await Resource.find({});
  res.json(resources);
});

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
export const getResourceById = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.findById(req.params.id);
  
  if (resource) {
    res.json(resource);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Search resources
// @route   GET /api/resources/search
// @access  Public
export const searchResources = asyncHandler(async (req: Request, res: Response) => {
  const { q, type, difficulty } = req.query;
  
  const query: any = {};
  
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (type) {
    query.type = type;
  }
  
  if (difficulty) {
    query.difficulty = difficulty;
  }
  
  const resources = await Resource.find(query);
  res.json(resources);
});

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private
export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, type, difficulty, url, tags } = req.body;
  
  const resource = new Resource({
    title,
    description,
    type,
    difficulty,
    url,
    tags,
    user: req.user._id
  });
  
  const createdResource = await resource.save();
  res.status(201).json(createdResource);
});

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, type, difficulty, url, tags } = req.body;
  
  const resource = await Resource.findById(req.params.id);
  
  if (resource) {
    resource.title = title || resource.title;
    resource.description = description || resource.description;
    resource.type = type || resource.type;
    resource.difficulty = difficulty || resource.difficulty;
    resource.url = url || resource.url;
    resource.tags = tags || resource.tags;
    
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.findById(req.params.id);
  
  if (resource) {
    await resource.remove();
    res.json({ message: 'Resource removed' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Rate resource
// @route   POST /api/resources/:id/rate
// @access  Private
export const rateResource = asyncHandler(async (req: Request, res: Response) => {
  const { rating } = req.body;
  
  const resource = await Resource.findById(req.params.id);
  
  if (resource) {
    resource.ratings.push(rating);
    await resource.save();
    res.json({ message: 'Rating added' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Comment on resource
// @route   POST /api/resources/:id/comments
// @access  Private
export const commentOnResource = asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body;
  
  const resource = await Resource.findById(req.params.id);
  
  if (resource) {
    resource.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });
    await resource.save();
    res.json({ message: 'Comment added' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});
