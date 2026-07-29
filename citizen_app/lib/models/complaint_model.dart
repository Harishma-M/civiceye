class ComplaintModel {
  final int id;
  final String trackingCode;
  final String title;
  final String description;
  final String category;
  final String priority;
  final String status;
  final double latitude;
  final double longitude;
  final String address;
  final String imageUrl;
  final double aiConfidence;
  final String department;
  final String createdAt;

  ComplaintModel({
    required this.id,
    required this.trackingCode,
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.status,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.imageUrl,
    required this.aiConfidence,
    required this.department,
    required this.createdAt,
  });

  factory ComplaintModel.fromJson(Map<String, dynamic> json) {
    return ComplaintModel(
      id: json['id'],
      trackingCode: json['tracking_code'],
      title: json['title'],
      description: json['description'] ?? '',
      category: json['category'],
      priority: json['priority'],
      status: json['status'],
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      address: json['address'] ?? '',
      imageUrl: json['images'] != null && json['images'].isNotEmpty
          ? json['images'][0]['image_url']
          : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
      aiConfidence: json['ai_prediction'] != null
          ? (json['ai_prediction']['confidence_percentage'] as num).toDouble()
          : 95.0,
      department: json['department'] != null ? json['department']['name'] : 'Municipality',
      createdAt: json['created_at'],
    );
  }
}
