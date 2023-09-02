<?php
// require 'vendor/autoload.php';

// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');  // pointing to the parent directory
// $dotenv->load();

// Connect to the database
$db = mysqli_connect(
  'database-1.xyz.ap-southeast-1.rds.amazonaws.com', 
  'admin', 
  'password', 
  'db_name');


// Handle create blog post
if (isset($_POST['title']) && isset($_POST['content'])) {
  $title = $_POST['title'];
  $content = $_POST['content'];

  $query = "INSERT INTO posts (title, content) VALUES ('$title', '$content')";

  mysqli_query($db, $query);
}

// Handle view blog posts
$query = "SELECT * FROM posts";
$result = mysqli_query($db, $query);



// Handle delete post
if (isset($_GET['delete_id'])) {
  $id = $_GET['delete_id'];

  $query = "DELETE FROM posts WHERE id = $id";
  mysqli_query($db, $query);
  header("Location: blog_index.php");
}
if (isset($_GET['id'])) {

  $id = $_GET['id'];
  $title = $_GET['title'];
  $content = $_GET['content'];

  $query = "UPDATE posts SET title='$title', content='$content' WHERE id=$id";

  mysqli_query($db, $query);

  header("Location: blog_index.php");
}

?>




<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>

<div class="container text-center my-5">

  <?php

  while ($row = mysqli_fetch_assoc($result)) {

    echo "<div class='border p-4 my-2'>";

    echo "<h2 class='h4'>" . $row['id'] . " " . $row['title'] . "</h2>";

    echo "<p>" . $row['content'] . "</p>";

    // Delete button
    echo "<form class='d-inline' method='get' action=''>";
    echo "<input type='hidden' name='delete_id' value='" . $row['id'] . "'>";
    echo "<button class='btn btn-danger'>Delete</button>";
    echo "</form>";

    // Edit button
    echo "<button class='btn btn-primary' onclick='editPost(" . $row['id'] . ")'>Edit</button>";

    // Edit form
    echo "<form id='editForm" . $row['id'] . "' style='display:none' method='get' action=''>";
    echo "<input type='hidden' name='id' value='" . $row['id'] . "'>";
    echo "<input type='text' name='title' value='" . $row['title'] . "'>";
    echo "<textarea name='content'>" . $row['content'] . "</textarea>";
    echo "<button type='submit'>Save</button>";
    echo "</form>";

    echo "</div>";
  }

  ?>

</div>

<div class="container text-center my-5">

  <h2 class="h3 mb-4">Create a Post</h2>

  <form method="post" class="mx-auto" style="max-width: 600px;">
    <div class="form-group">
      <label for="title">Title</label>
      <input type="text" id="title" name="title" class="form-control">
    </div>

    <div class="form-group">
      <label for="content">Content</label>
      <textarea id="content" name="content" class="form-control" rows="5"></textarea>
    </div>

    <button type="submit" class="btn btn-primary btn-block">Create Post</button>
  </form>

</div>

<script>
  function deletePost(id) {

    // AJAX request to delete post

    location.reload(); // Refresh page after delete

  }

  function editPost(id) {

    // Show edit form
    document.getElementById('editForm' + id).style.display = "block";

    // Hide other content
    document.getElementById('post' + id).style.display = "none";

  }
</script>